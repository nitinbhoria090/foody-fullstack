import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function CategoryPage() {

    const { category } = useParams();

    const navigate = useNavigate();

    const [products, setProducts] = useState([]);

    useEffect(() => {
    console.log("Category:", category);
    fetchProducts();
}, [category]);

const fetchProducts = async () => {
    try {

        console.log(
            "API:",
            `http://localhost:5000/api/products/category/${category}`
        );

        const res = await axios.get(
            `http://localhost:5000/api/category/${category}`
        );

        console.log(res.data);

        if (res.data.success) {
            setProducts(res.data.products);
        }

    } catch (error) {
        console.log(error);
    }
};
    return (

        <div className="min-h-screen bg-gray-100 py-12">

            <div className="max-w-7xl mx-auto px-5">

                <h1 className="text-4xl font-bold capitalize">

                    {category} Foods

                </h1>

                <p className="text-gray-500 mt-2">

                    {products.length} items available

                </p>

                <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-8 mt-10">

                    {

                        products.map((item)=>(

                            <div
                                key={item._id}
                                onClick={()=>navigate(`/product/${item._id}`)}
                                className="bg-white rounded-3xl shadow-lg overflow-hidden cursor-pointer hover:shadow-2xl transition"
                            >

                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="h-56 w-full object-cover"
                                />

                                <div className="p-5">

                                    <h3 className="text-xl font-bold">

                                        {item.name}

                                    </h3>

                                    <p className="text-gray-500 mt-2 line-clamp-2">

                                        {item.description}

                                    </p>

                                    <div className="flex justify-between items-center mt-5">

                                        <span className="text-orange-600 font-bold text-2xl">

                                            ₹{item.price}

                                        </span>

                                        <button className="bg-orange-500 text-white px-5 py-2 rounded-full">

                                            Add

                                        </button>

                                    </div>

                                </div>

                            </div>

                        ))

                    }

                </div>

            </div>

        </div>

    );

}

export default CategoryPage;