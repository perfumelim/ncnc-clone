import { GetServerSideProps, NextPage } from "next";
import Router, { useRouter } from "next/router";
import Header from "components/common/Header";

import {
  BrandAndProductListConCategory1,
  ClearanceList,
  MainCategory,
} from "types/response";
import {
  getBrandAndProductList,
  getClearanceList,
  getMainCategoryList,
} from "utils/api";
import GridCardList from "components/common/GridCardList";
import Path from "utils/path";
import styled from "styled-components";
import { Navigation } from "components/category/Navigation";
import ProductCardList from "components/common/ProductCardList";
import { useEffect, useState } from "react";

interface CategoryDetailProps {
  categoryDetailList: BrandAndProductListConCategory1 | ClearanceList | any;
  categoryList: MainCategory[];
}

const CategoryDetailPage: NextPage<CategoryDetailProps> = ({
  categoryDetailList,
  categoryList,
}) => {
  const router = useRouter();
  const [categoryDetailListData, setCategoryDetailListData] = useState([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (router.query.id === "1") {
      const temp = [];

      setCategoryDetailListData((prev) =>
        categoryDetailList.conCategory1.conCategory2s.map(
          (data: ClearanceList) =>
            data.conItems.map((item) => temp.push({ ...item }))
        )
      );
      setCategoryDetailListData(temp);

      setTitle(categoryDetailList.name);
    } else {
      setTitle(categoryDetailList.conCategory1.name);
    }
  }, [categoryDetailList, router]);

  console.log("categoryDetailListData", categoryDetailListData);

  return (
    <div>
      <Header title={title} leftIcon="back" />
      <Navigation item={categoryList} />
      {router.query.id === "1" ? (
        <ProductCardList data={categoryDetailListData} isClickable={true} />
      ) : (
        <GridCardContainer>
          <GridCardList
            data={categoryDetailList.conCategory1.conCategory2s}
            path={Path.Brands}
          />
        </GridCardContainer>
      )}
    </div>
  );
};

const GridCardContainer = styled.div`
  padding: 7px 17px 17px;
`;
export const getServerSideProps = async (context: any) => {
  const router = context.query.id;
  const categoryList = await getMainCategoryList();
  const data =
    router === 1
      ? await getClearanceList()
      : await getBrandAndProductList(router);
  return {
    props: {
      categoryDetailList: data,
      categoryList: categoryList.conCategory1s,
    },
  };
};

export default CategoryDetailPage;
