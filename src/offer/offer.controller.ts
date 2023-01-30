import { Controller, Get, Query } from '@nestjs/common';
import { OfferService } from './offer.service';

@Controller('offer')
export class OfferController {
  constructor(private readonly offerService: OfferService) {}
  @Get()
  async getModifiedResponse(
    @Query('offerApi') offerApi: string,
    @Query('checkinDate') checkinDate: string,
  ) {
    await this.offerService.setOffers(offerApi);
    this.offerService.setCheckinDate(checkinDate);
    return this.offerService.getModifiedResponse();
  }
}
