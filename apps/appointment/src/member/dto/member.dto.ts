export class MemberDto {
  id: string;

  user_id: string;

  name: string;

  dob: string;

  address: string;

  is_default: boolean;

  createdAt?: Date | string;

  createdById: string;

  updatedAt?: Date | string;

  updatedById: string;
}
