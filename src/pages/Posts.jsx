import { useFetch } from "../hooks/useFetch"

export default function Posts() {

    const { loading, data } = useFetch('https://jsonplaceholder.typicode.com/posts');

    return (

        <>

            <div className="space-y-6">

                {loading && <p>Loading....</p>}

                {(!loading && data.length > 0) && data.map((post) =>
                    <>
                        <div className="p-4 border-b flex items-center gap-3">
                            <div>
                                <h3 className="font-semibold text-lg">{post.title}</h3>
                                <p className="text-gray-600">{post.body}</p>
                            </div>
                        </div>
                    </>
                )
                }

            </div>
        </>
    )
}