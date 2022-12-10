/**
 * Merge des point alignés horizontalement ou verticalement (4-connected)
 */
class PointMerger {

    private startPoint: paper.Point | null;
    private endPoint: paper.Point | null;

    next(point : paper.Point | null) : paper.Point[] {
        if(point == null) { // Null lorsque l'on a passé le dernier point => lus de point à merger, on retourne ce qu'il reste
            if(this.endPoint != null) {
                return [this.startPoint, this.endPoint];
            } else if(this.startPoint != null) {
                return [this.startPoint];
            } else {
                return [];
            }
        } else {
            if (this.startPoint == null) { // On est sur le premier point
                this.startPoint = point;
                return [];
            } else {
                if(this.endPoint == null) { // On a déjà un point de départ
                    if(point.y == this.startPoint.y && point.x == this.startPoint.x) {
                        return []
                    } else if(point.y == this.startPoint.y
                        || point.x == this.startPoint.x) {
                        this.endPoint = point;
                        return [];
                    } else {
                        let result = [this.startPoint];
                        this.startPoint = point;
                        return result
                    }
                } else {
                    if(point.y == this.endPoint.y && point.x == this.endPoint.x) {
                        return [];

                    } else if(point.y == this.endPoint.y && Math.sign(this.endPoint.x - this.startPoint.x) == Math.sign(this.endPoint.x - this.startPoint.x)) {
                        // Dans l'alignement horizontal
                        this.endPoint = point;
                        return [];

                    } else  if(point.x == this.endPoint.x && Math.sign(this.endPoint.y - this.startPoint.y) == Math.sign(this.endPoint.y - this.startPoint.y)) {
                        // Dans l'alignement vertical
                        this.endPoint = point;
                        return [];

                    } else {
                        if(point.y == this.endPoint.y || point.x == this.endPoint.x) {
                            let result = [this.startPoint];
                            this.startPoint = this.endPoint;
                            this.endPoint = point;
                            return  result;

                        } else {
                            let result = [this.startPoint, this.endPoint];
                            this.startPoint = point;
                            this.endPoint = null;
                            return  result;
                        }
                    }
                }
            }
        }
    }
}
