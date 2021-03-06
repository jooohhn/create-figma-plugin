/** @jsx h */
import { h } from 'preact'
import { useCallback } from 'preact/hooks'

import { HTMLProps, OnChange } from '../../types'
import {
  DOWN_KEY_CODE,
  ESCAPE_KEY_CODE,
  LEFT_KEY_CODE,
  RIGHT_KEY_CODE,
  UP_KEY_CODE
} from '../../utilities/key-codes'
import styles from './tabs.scss'

export interface TabsProps {
  focused?: boolean
  name: string
  onChange: OnChange
  options: TabsOption[]
  propagateEscapeKeyDown?: boolean
  value: null | string
}

export interface TabsOption {
  disabled?: boolean
  text?: preact.ComponentChildren
  value: null | string
  view: preact.ComponentChildren
}

export function Tabs({
  focused,
  name,
  onChange,
  options,
  propagateEscapeKeyDown = true,
  value,
  ...rest
}: HTMLProps<TabsProps, HTMLInputElement>): h.JSX.Element {
  const handleChange = useCallback(
    function (event: Event) {
      const index = (event.target as HTMLElement).getAttribute('data-index')
      if (index === null) {
        return
      }
      const newValue = options[parseInt(index)].value
      onChange({ [name]: newValue }, newValue, name, event)
    },
    [name, onChange, options]
  )

  const handleKeyDown = useCallback(
    function (event: KeyboardEvent) {
      const keyCode = event.keyCode
      if (keyCode === ESCAPE_KEY_CODE) {
        if (propagateEscapeKeyDown === false) {
          event.stopPropagation()
        }
        ;(event.target as HTMLElement).blur()
        return
      }
      if (
        keyCode === DOWN_KEY_CODE ||
        keyCode === LEFT_KEY_CODE ||
        keyCode === RIGHT_KEY_CODE ||
        keyCode === UP_KEY_CODE
      ) {
        if (value === null) {
          const newValue = options[0].value
          onChange({ [name]: newValue }, newValue, name, event)
          return
        }
        const currentIndex = options.findIndex(function (option) {
          return option.value === value
        })
        let nextIndex =
          currentIndex +
          (keyCode === LEFT_KEY_CODE || keyCode === UP_KEY_CODE ? -1 : 1)
        if (nextIndex === -1) {
          nextIndex = options.length - 1
        }
        if (nextIndex === options.length) {
          nextIndex = 0
        }
        const newValue = options[nextIndex].value
        onChange({ [name]: newValue }, newValue, name, event)
      }
    },
    [name, onChange, options, propagateEscapeKeyDown, value]
  )

  const activeOption = options.find(function (option) {
    return option.value === value
  })

  return (
    <div>
      <div
        class={styles.tabs}
        data-initial-focus={focused === true}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        {options.map(function (option, index) {
          const text =
            typeof option.text === 'undefined' ? option.value : option.text
          return (
            <label key={index} class={styles.label}>
              <input
                {...rest}
                checked={value === option.value}
                class={styles.input}
                data-index={index}
                name={name}
                onChange={handleChange}
                tabIndex={-1}
                type="radio"
                value={option.value === null ? undefined : option.value}
              />
              <div class={styles.text} data-text={text}>
                {text}
              </div>
            </label>
          )
        })}
      </div>
      {typeof activeOption === 'undefined' ? null : activeOption.view}
    </div>
  )
}
