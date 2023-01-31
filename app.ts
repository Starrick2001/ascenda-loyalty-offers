import axios from "axios";
import { IOffer } from "./src/interfaces/offer.interface";
import { Offer } from "./src/modules/offer";

const getOffers = async (apiEndpoint: string): Promise<IOffer[]> => {
	const result = await (await axios.get(apiEndpoint)).data;
	return result.offers;
};

const main = async () => {
	const offers = new Offer(
		await getOffers(
			"https://61c3deadf1af4a0017d990e7.mockapi.io/offers/near_by?lat=1.313492&lon=103.860359&rad=20"
		),
		new Date("2019-12-25")
	);
	console.log(JSON.stringify(offers.getModifiedResponse(), null, 4));
};

main();
