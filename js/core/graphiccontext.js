var ctx
export default class GraphicContext{
    constructor(ctxTmp){
        ctx = ctxTmp
    }

    drawText(X, Y, W, H, Str, Align){
        var tmpW = ctx.measureText(Str).width
        var tmpH = ctx.measureText(Str).height
        var drawX = X + (W - tmpW) / 2
        var drawY = Y + (H - tmpH) / 2 + tmpH
        ctx.fillText(Str, drawX, W / 2)
    }
}