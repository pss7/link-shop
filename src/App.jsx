import { HashRouter, Route } from "react-router-dom"
import ComponentTest from "./components/pages/ComponentTest"
import ShopListPage from "./components/pages/ShopListPage"
import ShopDetailPage from "./components/pages/ShopDetailPage"
import { ToastContainer } from "react-toastify"
import ShopCreatePage from "./components/pages/ShopCreatePage"
import ShopUpdatePage from "./components/pages/ShopUpdatePage"


function App() {


  return (
    <>
      <HashRouter>
        <Route path="/" element={<ShopListPage />}></Route>
        <Route path="/shop-list" element={<ShopListPage />}></Route>
        <Route path="/shop-detail/:id" element={<ShopDetailPage />}></Route>
        <Route path="/shop-create" element={<ShopCreatePage />}></Route>
        <Route path="/shop-update/:id" element={<ShopUpdatePage />}></Route>
        <Route path="/component-test" element={<ComponentTest />}></Route>
      </HashRouter>

      <ToastContainer
        position="top-center"
        autoClose={1000}
        hideProgressBar={true}
        theme="colored"
      />

    </>
  )

}

export default App
