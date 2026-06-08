import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error, info) {
    if (import.meta.env.DEV) console.error('App error:', error, info.componentStack);
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24, textAlign: 'center', fontFamily: 'var(--font-body)' }}>
          <div>
            <h1 className="display" style={{ fontSize: 'clamp(28px,6vw,56px)', color: 'var(--green)' }}>Something broke.</h1>
            <p style={{ marginTop: 12, opacity: 0.7 }}>Please refresh the page.</p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
