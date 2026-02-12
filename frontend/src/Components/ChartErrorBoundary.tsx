import React from "react";
import { FaExclamationCircle } from "react-icons/fa";

interface Props {
  children: React.ReactNode;
  chartName?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ChartErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(`Chart Error (${this.props.chartName || "Unknown"}):`);
    console.error(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-white rounded-2xl p-6 shadow-md h-full flex flex-col items-center justify-center gap-4">
          <FaExclamationCircle className="text-4xl text-red-500" />
          <div className="text-center">
            <p className="text-red-600 font-semibold">
              Error rendering {this.props.chartName || "chart"}
            </p>
            <p className="text-gray-600 text-sm mt-2">
              {this.state.error?.message || "An unexpected error occurred"}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ChartErrorBoundary;
