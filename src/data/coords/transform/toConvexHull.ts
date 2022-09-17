import {PathCoords} from "../pathCoords";
import {Transformation} from "./transformation";

enum Orientation {
    Collinear = 0,
    Clockwise = 1,
    Counterclockwise= 2
}

/**
 * Génère une coque convexe
 * Jarvis’s Algorithm or Wrapping
 * @see https://www.geeksforgeeks.org/convex-hull-set-1-jarviss-algorithm-or-wrapping/
 */
export class ToConvexHull implements Transformation<PathCoords, PathCoords> {

    transform(pathCoords: PathCoords): PathCoords {
        return new PathCoords(this.convexHull(pathCoords.points));
    }

    /**
     *
     * Prints convex hull of a set of n points.
     */
    private convexHull(points : paper.Point[]) : paper.Point[] {
        if (points.length < 3) {
            return points;
        }

        // Initialize Result
        let hull = [];

        // Find the leftmost point
        let startIndex = 0;
        for (let i = 1; i < points.length; i++) {
            if (points[i].x < points[startIndex].x) {
                startIndex = i;
            }
        }

        // Start from leftmost point, keep moving
        // counterclockwise until reach the start point
        // again. This loop runs O(h) times where h is
        // number of points in result or output.
        let p = startIndex;
        do {

            // Add current point to result
            hull.push(points[p]);

            // Search for a point 'q' such that
            // orientation(p, q, x) is counterclockwise
            // for all points 'x'. The idea is to keep
            // track of last visited most counterclock-
            // wise point in q. If any point 'i' is more
            // counterclock-wise than q, then update q.
            let q = (p + 1) % points.length;

            for (let i = 0; i < points.length; i++) {
                // If i is more counterclockwise than
                // current q, then update q
                if (this.orientation(points[p], points[i], points[q]) == Orientation.Counterclockwise) {
                    q = i;
                }
            }

            // Now q is the most counterclockwise with
            // respect to p. Set p as q for next iteration,
            // so that q is added to result 'hull'
            p = q;

        } while (p != startIndex); // While we don't come to first point

        return hull;
    }

    /**
     * To find orientation of ordered triplet (p, q, r)
     */
    private orientation(p : paper.Point, q : paper.Point, r : paper.Point) : Orientation {
        let val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
        if (val == 0) {
            return Orientation.Collinear;
        } else if (val > 0) {
            return Orientation.Clockwise;
        } else {
            return Orientation.Counterclockwise;
        }
    }
}