import { useParams } from "react-router-dom";
import { useLocation } from 'react-router-dom'
const AddProduct: React.FC = () => {

  let { id } = useParams(); 
  const location = useLocation()
  const { meal } = location.state
  return <div>
    <h1>Add Product</h1>
    <h2>Using {id} object which is {meal} </h2>
    </div>
};

export default AddProduct;
