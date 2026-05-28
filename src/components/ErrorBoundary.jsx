import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{
          padding: '2rem',
          fontFamily: 'monospace',
          fontSize: '0.85rem',
          color: '#d32f2f',
          background: '#fff5f5',
          minHeight: '100vh',
          wordBreak: 'break-word'
        }}>
          <strong>App Error:</strong>
          <pre style={{ marginTop: '1rem', whiteSpace: 'pre-wrap' }}>
            {this.state.error.toString()}
            {'\n\n'}
            {this.state.error.stack}
          </pre>
        </div>
      )
    }
    return this.props.children
  }
}
