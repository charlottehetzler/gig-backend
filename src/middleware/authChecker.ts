import express from "express";
import { AuthData } from "../resolvers/user/auth";
import { AuthChecker } from "type-graphql";
const jwt = require('jsonwebtoken');

export interface Context {
  authData?: AuthData;
  req?: express.Request;
}

export const authChecker: AuthChecker<Context> = ({ context: { authData, req } }) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    authData.isAuth = false;
    console.log('no header');
  }
  const token = authHeader.split(' ')[1];
  if (!token || token === '') {
    authData.isAuth = false;
    console.log('no token');
  }
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, 'somesupersecretkey');
  } catch (err) {
    authData.isAuth = false;
    console.log('no verfication token');
  }
  if (!decodedToken) {
    authData.isAuth = false;
    console.log('no decoded token');
  }
  authData.isAuth = true;
  authData.userId = decodedToken.userId;
  authData.token = decodedToken;
  return true;
};