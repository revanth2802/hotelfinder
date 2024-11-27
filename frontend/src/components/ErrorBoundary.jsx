import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught an error', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container text-center my-5">
          <h1 className="text-danger">Something Went Wrong</h1>
          <p>We're sorry, but an error occurred while loading the page.</p>
          <button onClick={() => window.location.reload()} className="btn btn-primary">
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
