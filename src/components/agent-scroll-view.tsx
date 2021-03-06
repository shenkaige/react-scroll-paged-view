import React, { Component } from 'react'
import { ScrollViewProps } from 'react-native'
import RNScrollView from './RNScrollView'
import { get } from '../utils'

const viewKeys = ['scrollViewRef', 'scrollViewLayout', 'scrollViewSize']

interface IAgentScrollView extends ScrollViewProps {
  nativeProps?: any
}

export default class AgentScrollView extends Component<IAgentScrollView> {
  scrollViewRef: any

  scrollViewSize: any

  scrollViewLayout: { width: number; height: number }

  setScrollEnabled = (flag) => {
    if (this.scrollViewRef) {
      this.scrollViewRef.setScrollEnabled(flag)
    }
  }

  _setScrollViewSize = (width, height) => {
    if (width && height) {
      const oldSize = this.scrollViewSize || {}
      this.scrollViewSize = { width, height }

      const { onContentSizeChange } = this.props
      if (onContentSizeChange) onContentSizeChange(oldSize, this.scrollViewSize)
    }
  }

  _setScrollViewLayout = (event) => {
    if (event) {
      const { onLayout } = this.props
      const { layout } = event.nativeEvent
      const height = Math.ceil(layout.height)
      const width = Math.ceil(layout.width)

      this.scrollViewLayout = { width, height }
      onLayout && onLayout(event)
    }
  }

  _setScrollViewRef = (ref) => {
    if (ref) this.scrollViewRef = ref
  }

  _agentMethod = (propsKey, event) => {
    const { nativeProps } = this.props
    const method = get(this.props, propsKey)
    if (method) {
      const agentInfo = viewKeys.reduce(
        (p, key) => ({ ...p, [key]: this[key] || {} }),
        {}
      )
      method(event, agentInfo)
      const nativeMethod = get(nativeProps, propsKey)
      nativeMethod && nativeMethod(event)
    }
  }

  render() {
    return (
      <RNScrollView
        {...this.props}
        ref={this._setScrollViewRef}
        onLayout={this._setScrollViewLayout}
        onContentSizeChange={this._setScrollViewSize}
        // onMomentumScrollEnd={this._onMomentumScrollEnd}
        // onScrollEndDrag={this._onScrollEndDrag}
        onTouchStart={(event) => this._agentMethod('onTouchStart', event)}
        onTouchMove={(event) => this._agentMethod('onTouchMove', event)}
        // onTouchEnd={this._onTouchEnd}
      />
    )
  }
}
