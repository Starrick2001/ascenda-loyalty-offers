import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common/exceptions';
import { IMerchant } from './interfaces/merchant.interface';
import { IOffer } from './interfaces/offer.interface';

@Injectable()
export class OfferService {
  private offers: IOffer[];
  private checkinDate: Date;

  constructor(private readonly httpService: HttpService) {}

  public async setOffers(apiEndpoint: string) {
    if (apiEndpoint === '') throw new BadRequestException('Invalid URL');
    this.offers = (
      await this.httpService.axiosRef.get(apiEndpoint)
    ).data.offers;
  }

  public setCheckinDate(checkinDate: string) {
    this.checkinDate = new Date(checkinDate);
  }

  // Get the date after a number of days
  private addDays(date: Date, days: number): Date {
    const tempDate = new Date(date.getTime());
    tempDate.setDate(date.getDate() + days);
    return tempDate;
  }

  //  If an offer is available in multiple merchants, only select the closest merchant
  private selectClosestMerchant(offer: IOffer) {
    if (offer.merchants.length > 1) {
      let closestMerchant: IMerchant = offer.merchants[0];
      for (let index = 1; index < offer.merchants.length; index++) {
        if (offer.merchants[index].distance < closestMerchant.distance)
          closestMerchant = offer.merchants[index];
      }
      offer.merchants = [closestMerchant];
    }
    return offer;
  }

  // Get Offers filtered by Only select category Resturant , Retail & Activity offers
  // and Offer need to be valid till checkin date + 5 days.
  private getFilteredOffers(categories: number[]): IOffer[] {
    return this.offers.filter((element) => {
      return (
        categories.includes(element.category) &&
        new Date(element.valid_to) >= this.addDays(this.checkinDate, 5)
      );
    });
  }

  //  If an offer is available in multiple merchants, only select the closest merchant
  private mapClosestMerchantOffers(offers: IOffer[]): IOffer[] {
    return offers.map((element) => {
      return this.selectClosestMerchant(element);
    });
  }

  private sortByClosestMerchantOffers(offers: IOffer[]): IOffer[] {
    return offers.sort((a, b) => {
      return a.merchants[0].distance - b.merchants[0].distance;
    });
  }

  public getModifiedResponse() {
    const filteredOffers = this.getFilteredOffers([1, 2, 4]);
    const mapClosestMerchantOffers =
      this.mapClosestMerchantOffers(filteredOffers);
    const result = this.sortByClosestMerchantOffers(mapClosestMerchantOffers);

    return {
      offers: result.slice(0, 2),
    };
  }
}
