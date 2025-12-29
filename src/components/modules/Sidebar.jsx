import { NavLink } from "react-router-dom"
import { useFetch } from "../../hooks/useFetch"
//``

export default function Sidebar() {

    const { loading, data } = useFetch('https://jsonplaceholder.typicode.com/users');

    return (

        <>
            {loading && <p>Loading....</p>}

            <aside className="w-64 bg-gray-800 text-white p-6">
                <nav className="flex flex-col space-y-2 p-4">
                    <ul>
                    {(!loading && data.length > 0) && data.map((user) =>
                        <>
                        <li key={user.id}>
                            <NavLink to={`userposts/${user.id}`}
                                key={user.id}
                                className={({ isActive }) =>
                                    isActive
                                        ? "text-white bg-blue-600 px-4 py-2 rounded"
                                        : "text-gray-700 hover:bg-gray-200 px-4 py-2 rounded"
                                }
                            >
                                {user.name}
                            </NavLink>
                            </li>
                        </>
                    )
                    }
                    </ul>



                    {/*<NavLink to="/"
                    className={({ isActive }) =>
                        isActive
                            ? "text-white bg-blue-600 px-4 py-2 rounded"
                            : "text-gray-700 hover:bg-gray-200 px-4 py-2 rounded"
                    }
                >
                    Home
                </NavLink>*/}

                </nav>
            </aside>
        </>
    )
}