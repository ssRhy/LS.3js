// 定义行星路由映射
const PLANET_ROUTES = {
  月球: "/moon",
  宠物星球: "/pet-planet",
  亲情star: "/family-star",
  爱情star: "/love-star",
};

// 导航到指定行星页面
export const navigateToPlanet = (planetName) => {
  const route = PLANET_ROUTES[planetName];
  if (route) {
    // 添加过渡动画效果
    document.body.style.opacity = "0";
    document.body.style.transition = "opacity 0.5s ease";

    setTimeout(() => {
      window.location.href = route;
    }, 500);
  } else {
    console.warn(`No route defined for planet: ${planetName}`);
  }
};

// 获取行星路由
export const getPlanetRoute = (planetName) => {
  return PLANET_ROUTES[planetName] || "/";
};

// 检查是否是有效的行星路由
export const isValidPlanetRoute = (planetName) => {
  return planetName in PLANET_ROUTES;
};
