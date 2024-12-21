import { registerEnumType } from '@nestjs/graphql';

export enum BusinessTypeEnum {
  HOSPITAL = 'hospital',
  LABORATORY = 'laboratory',
  RADIOLOGY_CENTER = 'radiologyCenter',
  PHARMA_AGENCY = 'pharmaAgency',
}

registerEnumType(BusinessTypeEnum, { name: 'BusinessTypeEnum' });
