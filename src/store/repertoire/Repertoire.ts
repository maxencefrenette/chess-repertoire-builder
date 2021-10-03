import { RepertoirePosition } from "./RepertoirePosition"

export class Repertoire {
    positions: Record<string, RepertoirePosition>

    constructor() {
        this.positions = {}
    }
}
