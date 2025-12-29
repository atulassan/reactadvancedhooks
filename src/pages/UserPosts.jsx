import { useNavigate, useParams } from "react-router-dom";
import { useFetch } from "../hooks/useFetch"

export default function UserPosts() {

    const navigate = useNavigate();

    const { userId } = useParams();

    const { loading, data } = useFetch('https://jsonplaceholder.typicode.com/posts?userId=' + userId);

    const handleChange = (id) => {
        navigate(`/post/${id}`);
    }

    return (
        <>
            <div className="space-y-6">

                {loading && <p>Loading....</p>}

                {(!loading && data.length > 0) && data.map((post) =>
                    <>
                        <div className="p-4 border-b flex items-center gap-3" onClick={()=>handleChange(post.id)}>
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