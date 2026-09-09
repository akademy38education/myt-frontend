import { Component, type ErrorInfo, type ReactNode } from "react";
import { ErrorState } from "@/components/shared/ErrorState";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Top-level render-error safety net (mounted once around <RouterProvider/>
 * in app/App.tsx). Catches errors React's own render phase throws; it does
 * NOT catch async/data-fetching errors — those are handled by TanStack
 * Query's error state plus <ErrorState/> at the call site.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error("Unhandled render error", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center p-6">
          <ErrorState
            title="This page hit an unexpected error"
            description="Reloading usually resolves this. If it keeps happening, please contact support."
            onRetry={() => window.location.reload()}
          />
        </div>
      );
    }
    return this.props.children;
  }
}
