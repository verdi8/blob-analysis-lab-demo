/**
 * Des utilitaires de géométrie
 */
import {EllipseCoords} from "../ellipseCoords";
import {Coords} from "../coords";
import * as paper from "paper";
import {types} from "sass";
import Color = types.Color;
import {Transformation} from "./transformation";
import {PathCoords} from "../pathCoords";
import {ImageDataWrapper} from "../../../render/ImageDataWrapper";
const  HALFPI  : number= 1.5707963267949;

/**
 * Adaptation de EllipseFitter.java de ImageJ
 */
export class ToEllipseFitter implements Transformation<PathCoords, Coords>{

    private bitCount : number = 0;
    private xsum : number = 0;
    private ysum : number = 0;
    private x2sum : number = 0;
    private y2sum : number = 0;
    private xysum : number = 0;
    private left : number = 0;
    private top : number = 0;
    private width : number = 0;
    private height : number = 0;
    private n : number = 0;
    private xm : number = 0;
    private ym : number = 0;   //mean values
    private u20 : number = 0;
    private u02 : number = 0;
    private u11 : number = 0;  //central moments
    private record : boolean = false;

    transform(from: Coords): EllipseCoords {

        /** X centroid */
        let xCenter : number;

        /** X centroid */
        let  yCenter : number;

        /** Length of major axis */
        let major : number;

        /** Length of minor axis */
        let minor : number;

        /** Angle in degrees */
        let angle : number;

        /** Angle in radians */
        let  theta : number;


        const path = from.toRemovedPath();
        let  bounds = path.bounds;
        this.left = Math.round(bounds.x);
        this.top = Math.round(bounds.y);
        this.width = Math.round(bounds.width);
        this.height = Math.round(bounds.height);

        const sqrtPi = 1.772453851; // Math.sqrt(Math.PI)
        let  a11 : number, a12 : number, a22 : number, m4 : number, z : number, scale : number, tmp : number, xoffset : number, yoffset : number;
        let  RealAngle : number;

        this.computeSums(path);
        this.getMoments();
        m4 = 4.0 * Math.abs(this.u02 * this.u20 - this.u11 * this.u11);
        if (m4 < 0.000001)
            m4 = 0.000001;
        a11 = this.u02 / m4;
        a12 = this.u11 / m4;
        a22 = this.u20 / m4;
        xoffset = this.xm;
        yoffset = this.ym;

        tmp = a11 - a22;
        if (tmp == 0.0)
            tmp = 0.000001;
        theta = 0.5 * Math.atan(2.0 * a12 / tmp);
        if (theta < 0.0)
            theta += HALFPI;
        if (a12 > 0.0)
            theta += HALFPI;
        else if (a12 == 0.0) {
            if (a22 > a11) {
                theta = 0.0;
                tmp = a22;
                a22 = a11;
                a11 = tmp;
            } else if (a11 != a22)
                theta = HALFPI;
        }
        tmp = Math.sin(theta);
        if (tmp == 0.0)
            tmp = 0.000001;
        z = a12 * Math.cos(theta) / tmp;
        major = Math.sqrt (1.0 / Math.abs(a22 + z));
        minor = Math.sqrt (1.0 / Math.abs(a11 - z));
        scale = Math.sqrt (this.bitCount / (Math.PI * major * minor)); //equalize areas
        major = major*scale*2.0;
        minor = minor*scale*2.0;
        angle = 180.0 * theta / Math.PI;
        if (angle == 180.0)
            angle = 0.0;
        if (major < minor) {
            tmp = major;
            major = minor;
            minor = tmp;
        }
        xCenter = this.left + xoffset + 0.5;
        yCenter = this.top + yoffset + 0.5;

        return new EllipseCoords(new paper.Point(xCenter, yCenter),  major / 2,  minor / 2, -angle);
    }

    private  computeSums (path : paper.Path)  : void {
        this.xsum = 0.0;
        this.ysum = 0.0;
        this.x2sum = 0.0;
        this.y2sum = 0.0;
        this.xysum = 0.0;
        let bitcountOfLine : number;
        let   xe : number;
        let ye : number;
        let  xSumOfLine : number;

        // optim : minCenterDist
        let center = path.bounds.center;
        let minCenterDist = path.bounds.width;
        for (let i = 0; i < path.length; i++) {
            let point = path.getPointAt(i);
            minCenterDist = Math.min(
                minCenterDist,
                point.getDistance(center)
            );
        }

        path.fillColor = new paper.Color("red");
        path.strokeColor = null;
        const raster = path.rasterize({insert: false});

        const pixelRatio = paper.view.pixelRatio;

        const rasterDataAccess = ImageDataWrapper.forRaster(raster);
        for (let y = 0; y < this.height; y++) {
            bitcountOfLine = 0;
            xSumOfLine = 0;
            let  offset = Math.round(y * pixelRatio) * raster.width * 4;
            for (let x=0; x < this.width; x++) {
                if(rasterDataAccess.getRgbaAt(Math.round(x * pixelRatio), Math.round(y * pixelRatio)).r > 0) {
                    bitcountOfLine++;
                    xSumOfLine += x;
                    this.x2sum += x * x;
                }
            }

            this.xsum += xSumOfLine;
            this.ysum += bitcountOfLine * y;
            ye = y;
            xe = xSumOfLine;
            this.xysum += xe*ye;
            this.y2sum += ye*ye*bitcountOfLine;
            this.bitCount += bitcountOfLine;
        }
    }

    public getMoments ()  : void {
        let   x1 : number, y1: number, x2: number, y2: number, xy: number;

        if (this.bitCount == 0)
            return;

        this.x2sum += 0.08333333 * this.bitCount;
        this.y2sum += 0.08333333 * this.bitCount;
        this.n = this.bitCount;
        x1 = this.xsum/ this.n;
        y1 = this.ysum / this.n;
        x2 = this.x2sum / this.n;
        y2 = this.y2sum / this.n;
        xy = this.xysum / this.n;
        this.xm = x1;
        this.ym = y1;
        this.u20 = x2 - (x1 * x1);
        this.u02 = y2 - (y1 * y1);
        this.u11 = xy - x1 * y1;
    }



}