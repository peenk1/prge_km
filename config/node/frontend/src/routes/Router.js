import {createHashRouter} from "react-router-dom";
import {Home, About, Map, Services, ListOfItems, AddPlace} from "./LazyImports";



const routes = createHashRouter(
    [
        {
            path: '/',
            element: <Home/>
        },
        {
            path: '/about',
            element: <About/>
        },
        {
            path: '/map',
            element: <Map/>
        },
        {
            path: '/services',
            element: <Services/>
        },
        {
            path: '/list',
            element: <ListOfItems/>
        },
        {
            path: '*',
            element: <div>404</div>
        },
        {
            path: "/add",
            element: <AddPlace/>
        }
    ]
)


export default routes;