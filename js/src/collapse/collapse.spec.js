import Collapse from './collapse'
import EventHandler from '../dom/eventHandler'

/** Test helpers */
import { getFixture, clearFixture } from '../../tests/helpers/fixture'

describe('Collapse', () => {
  let fixtureEl

  beforeAll(() => {
    fixtureEl = getFixture()
  })

  afterEach(() => {
    clearFixture()
  })

  describe('VERSION', () => {
    it('should return plugin version', () => {
      expect(Collapse.VERSION).toEqual(jasmine.any(String))
    })
  })

  describe('Default', () => {
    it('should return plugin default config', () => {
      expect(Collapse.Default).toEqual(jasmine.any(Object))
    })
  })

  describe('toggle', () => {
    it('should call show method if show class is not present', () => {
      fixtureEl.innerHTML = '<div></div>'

      const collapseEl = fixtureEl.querySelector('div')
      const collapse = new Collapse(collapseEl)

      spyOn(collapse, 'show')

      collapse.toggle()

      expect(collapse.show).toHaveBeenCalled()
    })

    it('should call hide method if show class is present', () => {
      fixtureEl.innerHTML = '<div class="show"></div>'

      const collapseEl = fixtureEl.querySelector('.show')
      const collapse = new Collapse(collapseEl, {
        toggle: false
      })

      spyOn(collapse, 'hide')

      collapse.toggle()

      expect(collapse.hide).toHaveBeenCalled()
    })
  })

  describe('show', () => {
    it('should do nothing if is transitioning', () => {
      fixtureEl.innerHTML = '<div></div>'

      spyOn(EventHandler, 'trigger')

      const collapseEl = fixtureEl.querySelector('div')
      const collapse = new Collapse(collapseEl, {
        toggle: false
      })

      collapse._isTransitioning = true
      collapse.show()

      expect(EventHandler.trigger).not.toHaveBeenCalled()
    })

    it('should do nothing if already shown', () => {
      fixtureEl.innerHTML = '<div class="show"></div>'

      spyOn(EventHandler, 'trigger')

      const collapseEl = fixtureEl.querySelector('div')
      const collapse = new Collapse(collapseEl, {
        toggle: false
      })

      collapse.show()

      expect(EventHandler.trigger).not.toHaveBeenCalled()
    })

    it('should show a collapsed element', done => {
      fixtureEl.innerHTML = '<div class="collapse" style="height: 0px;"></div>'

      const collapseEl = fixtureEl.querySelector('div')
      const collapse = new Collapse(collapseEl, {
        toggle: false
      })

      collapseEl.addEventListener('show.bs.collapse', () => {
        expect(collapseEl.style.height).toEqual('0px')
      })
      collapseEl.addEventListener('shown.bs.collapse', () => {
        expect(collapseEl.classList.contains('show')).toEqual(true)
        expect(collapseEl.style.height).toEqual('')
        done()
      })

      collapse.show()
    })

    it('should collapse only the first collapse', done => {
      fixtureEl.innerHTML = [
        '<div class="card" id="accordion1">',
        '  <div id="collapse1" class="collapse"/>',
        '</div>',
        '<div class="card" id="accordion2">',
        '  <div id="collapse2" class="collapse show"/>',
        '</div>'
      ].join('')

      const el1 = fixtureEl.querySelector('#collapse1')
      const el2 = fixtureEl.querySelector('#collapse2')
      const collapse = new Collapse(el1, {
        toggle: false
      })

      el1.addEventListener('shown.bs.collapse', () => {
        expect(el1.classList.contains('show')).toEqual(true)
        expect(el2.classList.contains('show')).toEqual(true)
        done()
      })

      collapse.show()
    })

    it('should not fire shown when show is prevented', done => {
      fixtureEl.innerHTML = '<div class="collapse"></div>'

      const collapseEl = fixtureEl.querySelector('div')
      const collapse = new Collapse(collapseEl, {
        toggle: false
      })

      const expectEnd = () => {
        setTimeout(() => {
          expect().nothing()
          done()
        }, 10)
      }

      collapseEl.addEventListener('show.bs.collapse', e => {
        e.preventDefault()
        expectEnd()
      })

      collapseEl.addEventListener('shown.bs.collapse', () => {
        throw new Error('should not fire shown event')
      })

      collapse.show()
    })
  })

  describe('hide', () => {
    it('should hide a collapsed element', done => {
      fixtureEl.innerHTML = '<div class="collapse show"></div>'

      const collapseEl = fixtureEl.querySelector('div')
      const collapse = new Collapse(collapseEl, {
        toggle: false
      })

      collapseEl.addEventListener('hidden.bs.collapse', () => {
        expect(collapseEl.classList.contains('show')).toEqual(false)
        expect(collapseEl.style.height).toEqual('')
        done()
      })

      collapse.hide()
    })
  })

  describe('data-api', () => {
    it('should show multiple collapsed elements', done => {
      fixtureEl.innerHTML = [
        '<a role="button" data-toggle="collapse" class="collapsed" href=".multi"></a>',
        '<div id="collapse1" class="collapse multi"/>',
        '<div id="collapse2" class="collapse multi"/>'
      ].join('')

      const trigger = fixtureEl.querySelector('a')
      const collapse1 = fixtureEl.querySelector('#collapse1')
      const collapse2 = fixtureEl.querySelector('#collapse2')

      collapse2.addEventListener('shown.bs.collapse', () => {
        expect(collapse1.classList.contains('show')).toEqual(true)
        expect(collapse1.classList.contains('show')).toEqual(true)
        done()
      })

      trigger.click()
    })

    it('should remove "collapsed" class from target when collapse is shown', done => {
      fixtureEl.innerHTML = [
        '<a role="button" data-toggle="collapse" class="collapsed" href="#" data-target="#test1" />',
        '<div id="test1"></div>'
      ].join('')

      const link = fixtureEl.querySelector('a')
      const collapseTest1 = fixtureEl.querySelector('#test1')

      collapseTest1.addEventListener('shown.bs.collapse', () => {
        expect(link.classList.contains('collapsed')).toEqual(false)
        done()
      })

      link.click()
    })
  })
})
