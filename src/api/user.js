import request from "@/utils/request";
export function login(data) {
  return request({
    url: "/auth/login",
    method: "post",
    data,
  });
}
export function getInfo(token) {
  return request({
    url: "/auth/me",
    method: "post",
  });
}
export function logout() {
  return request({
    url: "/auth/logout",
    method: "post",
  });
}

export function register(data) {
  return request({
    url: `/register`,
    method: "post",
    data,
  });
}
