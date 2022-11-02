import React, { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { QUERY_CATEGORIES } from "../../utils/queries";
import {
  UPDATE_CATEGORIES,
  UPDATE_CURRENT_CATEGORY,
} from "../../utils/actions";
import { useStoreContext } from "../../utils/GlobalState";
import { idbPromise } from "../../utils/helpers";
import "./index.css";

function CategoryMenu() {
  //call upon useStoreContext to retrieve the current state from global state object and use dispatch to update state
  const [state, dispatch] = useStoreContext();

  //destructure categories out of the state returned by the storecontext
  const { categories } = state;

  // dont actually have any data in state, so we need to use categoryData that returns and use the dispatch method to set our global state
  const { loading, data: categoryData } = useQuery(QUERY_CATEGORIES);

  useEffect(() => {
    if (categoryData) {
      dispatch({
        type: UPDATE_CATEGORIES,
        categories: categoryData.categories,
      });
      categoryData.categories.forEach((category) => {
        idbPromise("categories", "put", category);
      });
    } else if (!loading) {
      idbPromise("categories", "get").then((categories) => {
        dispatch({
          type: UPDATE_CATEGORIES,
          categories: categories,
        });
      });
    }
  }, [categoryData, loading, dispatch]);

  //update the click handler to update global state instead of using the function we recieve as a prop form the home component
  const handleClick = (id) => {
    dispatch({
      type: UPDATE_CURRENT_CATEGORY,
      currentCategory: id,
    });
  };
  return (
    <div className="categoryNav flex">
      <div className="title">
        <h2 className="heavy  abril">Pick a Category!</h2>
      </div>

      <div className="category-section">
        {categories.map((item) => (
          <a
            className="categories"
            key={item._id}
            onClick={() => {
              handleClick(item._id);
            }}
          >
            <img
              className="btn-img"
              src={require(`../../../public/images/${item.img}`)}
            />
          </a>
        ))}
      </div>
    </div>
  );
}

export default CategoryMenu;
