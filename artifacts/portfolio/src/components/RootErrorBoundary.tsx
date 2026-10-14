import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = { children: ReactNode };
type State = { error: Error | null };

export class RootErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[root-error-boundary]", error, info.componentStack);
  }

  handleRetry = () => {
    this.setState({ error: null });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.error) {
      return this.props.children;
    }

    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center flex flex-col items-center gap-4">
          <p className="text-sm text-muted-foreground font-mono" dir="auto">
            Something went wrong while loading this page.
          </p>
          <p className="text-xs text-muted-foreground/70 font-mono break-all" dir="auto">
            {this.state.error.message}
          </p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={this.handleRetry}
              className="min-h-11 rounded-md border border-primary/35 px-4 text-sm font-bold text-primary transition hover:bg-primary hover:text-primary-foreground"
            >
              Retry
            </button>
            <button
              type="button"
              onClick={this.handleReload}
              className="min-h-11 rounded-md border border-border px-4 text-sm font-bold text-foreground transition hover:bg-muted"
            >
              Reload
            </button>
          </div>
        </div>
      </div>
    );
  }
}
