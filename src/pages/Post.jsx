import { useParams } from "react-router-dom";
//import { useFetch } from "../hooks/useFetch"
import { useChainFetch } from "../hooks/useChainFetch";
//``

export default function UserPosts() {

    const { postId } = useParams();

    /*const { loading: postLoading, data: post } = useFetch('https://jsonplaceholder.typicode.com/posts/' + postId);
    const { loading: commentLoading, data: comments } = useFetch('https://jsonplaceholder.typicode.com/posts/' + postId + '/comments');*/

    const { loading, results } = useChainFetch([
        () => `https://jsonplaceholder.typicode.com/posts/${postId}`,
        (post) => `https://jsonplaceholder.typicode.com/posts/${post.id}/comments`,
    ]);

    console.log('++++loading', loading);
    console.log("++++++++++use Final Fetch Final Result", results);

    return (
        <>

            { loading && <p>Loading Comments....</p> }

            {(!loading && results.length > 0) && 
                <div className="p-4 border-b flex items-center gap-3">
                    <div>
                        <h3 className="font-semibold text-lg">{results[0]['title']}</h3>
                        <p className="text-gray-600">{results[0]['body']}</p>
                    </div>
                </div>
            }

            <div className="antialiased max-w-screen-sm">
                {(!loading && results.length > 0) && <h3 className="mb-4 mt-4 text-lg font-semibold text-gray-900">Comments</h3> }

                <div className="space-y-4">
                    {(!loading && results.length > 0) && results[1].map((comment) =>

                        <div className="flex" key={comment.id}>
                            <div className="flex-shrink-0 mr-3">
                                <img className="mt-2 rounded-full w-8 h-8 sm:w-10 sm:h-10" src="https://images.unsplash.com/photo-1604426633861-11b2faead63c?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200&q=80" alt="" />
                            </div>
                            <div className="flex-1 border rounded-lg px-4 py-2 sm:px-6 sm:py-4 leading-relaxed">
                                <strong>{comment.name}</strong> <span className="text-xs text-gray-400">{comment.email}</span>
                                <p className="text-sm">
                                    {comment.body}
                                </p>
                            </div>
                        </div>
                    )
                    }
                </div>
            </div>

    

        </>
    )
}