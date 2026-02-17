import { useState } from "react";
import AddingCategoryTab from "../Components/AddingCategoryTab";

function AddCategory() {
  const [isCatAdd, setIsCatAdd] = useState(false);
  return <AddingCategoryTab isCatAdd={isCatAdd} setIsCatAdd={setIsCatAdd} />
  ;
}

export default AddCategory;
