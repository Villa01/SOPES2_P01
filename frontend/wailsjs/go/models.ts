export namespace main {
	
	export class HardWareResponse {
	    // Go type: osStats.CPUStats
	    cpu_stats: any;
	    // Go type: osStats.DiskStats
	    disk_stats: any;
	    // Go type: osStats.RAMStats
	    ram_stats: any;
	
	    static createFrom(source: any = {}) {
	        return new HardWareResponse(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.cpu_stats = this.convertValues(source["cpu_stats"], null);
	        this.disk_stats = this.convertValues(source["disk_stats"], null);
	        this.ram_stats = this.convertValues(source["ram_stats"], null);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

