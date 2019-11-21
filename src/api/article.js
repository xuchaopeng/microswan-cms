import axios from "@/libs/api.request";

export const saveArticle = param => {
  return axios.request({
    url: "/api/admin/saveArticle",
    data: {
      articleInformation: param
    },
    method: "post"
  });
};

export const getArticleList = param => {
  return axios.request({
    url: "/api/articleList",
    method: "post"
  });
};

export const getArticleDetail = param => {
  return axios.request({
    method: "get",
    url: "/api/articleDetail/" + param.id
  });
};

export const updateArticleDetail = param => {
  return axios.request({
    method: "post",
    url: "/api/admin/updateArticle",
    data: {
      articleInformation: param
    }
  });
};

export const deleteArticle = param => {
  return axios.request({
    method: "post",
    url: "/api/admin/deleteArticle",
    data: {
      _id: param._id
    }
  });
};
