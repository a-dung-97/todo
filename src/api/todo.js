import request from "@/utils/request";

export function index(params) {
  return request({
    url: "/todos",
    method: "get",
    params,
  });
}
export function store(data) {
  return request({
    url: "/todos",
    method: "post",
    data,
  });
}
export function update(id, data) {
  return request({
    url: `/todos/${id}`,
    method: "put",
    data,
  });
}
export function finish(id) {
  return request({
    url: `/todos/${id}/finish`,
    method: "put",
  });
}

export function destroy(id) {
  return request({
    url: `/todos/${id}`,
    method: "delete",
  });
}
