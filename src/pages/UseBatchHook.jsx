import { useBatchFetch } from "../hooks/useBatchFetch";


export default function UseBatchHook() {

    const apis = [
        'https://jsonplaceholder.typicode.com/posts/1',
        'https://jsonplaceholder.typicode.com/posts/2',
        'https://jsonplaceholder.typicode.com/posts/3',
        'https://jsonplaceholder.typicode.com/posts/4',
        'https://jsonplaceholder.typicode.com/posts/5'
    ];

    const { loading, results, error } = useBatchFetch(apis, 2);

    console.log(loading, results, error);

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">useBatchFetch Hook Demo</h1>
            
            {loading && (
                <div className="text-blue-600 mb-4">Loading batches...</div>
            )}
            
            {error && (
                <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                    Error: {error}
                </div>
            )}
            
            <div className="space-y-2">
                {results.map((result, index) => (
                    <div 
                        key={index} 
                        className={`p-4 rounded ${
                            result.success 
                                ? 'bg-green-50 border border-green-200' 
                                : 'bg-red-50 border border-red-200'
                        }`}
                    >
                        {result.success ? (
                            <div>
                                <div className="font-semibold text-green-700">
                                    Success - Post {result.data?.id}
                                </div>
                                <div className="text-sm mt-1">{result.data?.title}</div>
                            </div>
                        ) : (
                            <div className="text-red-700">
                                Error: {result.error}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );

}
