import { Response, Request, NextFunction } from 'express';

export const wrapAsync = (func) => {
    return (req, res, next) => {
        func(req, res, next).catch(next);
    };
}