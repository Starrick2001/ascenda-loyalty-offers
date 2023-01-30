import { Test, TestingModule } from '@nestjs/testing';
import { OfferService } from './offer.service';
import { HttpModule } from '@nestjs/axios';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common/exceptions';

describe('OfferService', () => {
  let service: OfferService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [OfferService],
    }).compile();

    service = module.get<OfferService>(OfferService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('setOffers', () => {
    it('should throw bad request exception', async () => {
      try {
        await service.setOffers('');
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestException);
        expect(e.message).toBe('Invalid URL');
      }
    });
  });

  describe('getModifiedResponse', () => {
    it('should return modified response', async () => {
      // Arrange
      await service.setOffers(
        'https://61c3deadf1af4a0017d990e7.mockapi.io/offers/near_by?lat=1.313492&lon=103.860359&rad=20',
      );
      service.setCheckinDate('2019-12-25');

      const payload = {
        offers: [
          {
            id: 1,
            title: 'Offer 1',
            description: 'Offer 1 description',
            category: 1,
            merchants: [
              {
                id: 1,
                name: 'Offer1 Merchant1',
                distance: 0.5,
              },
            ],
            valid_to: '2020-02-01',
          },
          {
            id: 3,
            title: 'Offer 3',
            description: 'Offer 3 description',
            category: 2,
            merchants: [
              {
                id: 3,
                name: 'Offer3 Merchant1',
                distance: 0.8,
              },
            ],
            valid_to: '2020-01-01',
          },
        ],
      };

      // Act
      const getModifiedResponse = service.getModifiedResponse();

      // Assert
      expect(getModifiedResponse).toStrictEqual(payload);
    });
  });
});
