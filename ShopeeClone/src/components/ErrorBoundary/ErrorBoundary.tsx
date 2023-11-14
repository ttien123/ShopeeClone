import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
    };

    public static getDerivedStateFromError(_: Error): State {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // You can also log the error to an error reporting service
        console.error('Uncaught error: ', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <div>
                    <div className="h-screen w-screen bg-gray-50 flex items-center">
                        <div className="container flex flex-col md:flex-row items-center justify-between px-5 text-gray-700">
                            <div className="w-full lg:w-1/2 mx-8">
                                <div className="text-7xl text-green-500 font-dark font-extrabold mb-8"> 404</div>
                                <p className="text-2xl md:text-3xl font-light leading-normal mb-8">
                                    Sorry we couldn't find the page you're looking for
                                </p>
                                <a
                                    href="/"
                                    className="px-5 inline py-3 text-sm font-medium leading-5 shadow-2xl text-white transition-all duration-400 border border-transparent rounded-lg focus:outline-none bg-green-600 active:bg-red-600 hover:bg-red-700"
                                >
                                    back to homepage
                                </a>
                            </div>
                            <div className="w-full lg:flex lg:justify-end lg:w-1/2 mx-5 my-12">
                                <img
                                    src="https://user-images.githubusercontent.com/43953425/166269493-acd08ccb-4df3-4474-95c7-ad1034d3c070.svg"
                                    alt="Page not found"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
