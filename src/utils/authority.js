import { reloadAuthorized } from './Authorized';
import {setCookie } from '@/services/common';

function getCookie(name) {
  var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");

  if (arr = document.cookie.match(reg)) {
      return unescape(arr[2]);
  }
  else {
      return null;
  }
}

export function getAuthority(str) {
  const authorityString =
    typeof str === 'undefined' ? getCookie('state-grid-authority') : str;

  let authority;

  try {
    if (authorityString) {
      authority = JSON.parse(authorityString);
    }
  } catch (e) {
    authority = authorityString;
  }

  if (typeof authority === 'string') {
    return [authority];
  }

  if (authority) {
    if (authority.login_mode.indexOf("管理员") != -1) {
      return ["admin"]
    }
    return ["user"];
  }
  
  return "";
}
export function setAuthority(authority) {
  const proAuthority = typeof authority === 'string' ? [authority] : authority;
  setCookie('state-grid-authority', JSON.stringify(proAuthority), 1);

  reloadAuthorized();
}

