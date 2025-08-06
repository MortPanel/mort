export const requireAuth = (req: any, res: any, next: any) => {
    if (!req.user) return res.status(401).json({
        success: false,
        message: 'Unauthorized'
    });
    next();
}

export const requireNoAuth = (req: any, res: any, next: any) => {
    if (req.user) return res.status(403).json({
        success: false,
        message: 'Already authenticated'
    });
    next();
}