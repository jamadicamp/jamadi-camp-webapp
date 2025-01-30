export interface Room {
	images: Image[];
	amenities: Amenities;
	description: string;
	breakfast_included: boolean;
	has_parking: boolean;
	adults_only: boolean;
	pets_allowed: any;
	show_additional_key_facts: boolean;
	id: number;
	name: string;
	image_url: string;
	max_people: number;
	units: number;
	has_wifi: boolean;
	has_meal_plan: boolean;
	bedrooms: number;
	bathrooms: number;
	area_unit: string;
	area: number;
	min_price: number;
	original_min_price: number;
	max_price: number;
	original_max_price: number;
	price_unit_in_days: number;
	currency: Currency;
}

export interface Image {
	text: string;
	url: string;
}

export interface Amenities {
	room: Room[];
	"further-info": any[];
	cooking: any[];
	entertainment: Entertainment[];
	heating: Heating[];
	laundry: any[];
	livingroom: any[];
	miscellaneous: Miscellaneou[];
	outside: Outside[];
	sanitary: Sanitary[];
	sleeping: Sleeping[];
	parking: Parking[];
}

export interface Room {
	name: string;
	prefix: string;
	bracket: string;
	text: string;
}

export interface Entertainment {
	name: string;
	prefix: string;
	bracket: any;
	text: string;
}

export interface Heating {
	name: string;
	prefix: any;
	bracket: any;
	text: string;
}

export interface Miscellaneou {
	name: string;
	prefix: any;
	bracket: any;
	text: string;
}

export interface Outside {
	name: string;
	prefix: string;
	bracket: string;
	text: string;
}

export interface Sanitary {
	name: string;
	prefix: any;
	bracket: any;
	text: string;
}

export interface Sleeping {
	name: string;
	prefix: string;
	bracket: any;
	text: string;
}

export interface Parking {
	name: string;
	prefix: any;
	bracket: any;
	text: string;
}

export interface Currency {
	id: number;
	code: string;
	name: string;
	euro_forex: number;
	symbol: string;
}
