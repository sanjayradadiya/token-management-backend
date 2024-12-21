import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  And,
  Between,
  FindManyOptions,
  FindOptionsWhere,
  In,
  MoreThan,
  Not,
  Repository,
} from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { UpdateAppointmentInput } from './dto/update-appoinment.input';
import { CreateAppointmentInput } from './dto/create-appoinment.input';
import { Appointment } from './entities/appointment.entities';
import { AppointmentFilter } from './dto/filter-appoinment';
import { BusinessService } from 'libs/lib/src/business/business.service';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entities';
import { SortProps } from 'libs/lib/src/args/sorts';
import { PageInfoProps } from 'libs/lib/src/args/pageInfo';
import { Appointments } from './types/appointmentList';
import { MemberService } from '../member/member.service';
import { AppointmentStatusEnum } from './types/enum';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    @Inject(forwardRef(() => BusinessService))
    private businessService: BusinessService,
    @Inject(forwardRef(() => MemberService))
    private memberService: MemberService,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    private service: ConfigService,
  ) {
    this.initializeBaseUrl();
  }

  base_url: string;
  async initializeBaseUrl() {
    this.base_url = await this.service.get('FRONT_END_BASE_URL');
  }

  async generateToken(businessId: string): Promise<any> {
    const today = new Date().toISOString().split('T')[0];

    const startOfDay = new Date(today + 'T00:00:00').toISOString();
    const endOfDay = new Date(today + 'T23:59:59').toISOString();

    const lastAppointmentToday = await this.appointmentRepository.findOne({
      where: {
        date_and_time: Between(startOfDay, endOfDay),
        business: { id: businessId },
      },
      order: { tokenNumber: 'DESC' },
    });

    let newTokenNumber = 1;

    if (lastAppointmentToday) {
      newTokenNumber = lastAppointmentToday.tokenNumber + 1;
    }

    return newTokenNumber;
  }

  async create(createAppointmentInput: CreateAppointmentInput): Promise<any> {
    const userData = await this.userService.findUserById(
      createAppointmentInput.userId,
    );
    const businessData = await this.businessService.findBusinessById(
      createAppointmentInput.businessId,
    );
    const memberData = await this.memberService.findOneById(
      createAppointmentInput.memberId,
    );

    const token = await this.generateToken(createAppointmentInput.businessId);
    const appointment: Appointment = new Appointment();
    const today = new Date().toISOString().split('T')[0];

    appointment.member = memberData;
    appointment.business = businessData;
    appointment.tokenNumber = token;
    appointment.user = userData;
    appointment.date_and_time = today;

    try {
      await this.appointmentRepository.save(appointment);
      return {
        success: true,
        reason: 'The new Appointment has been successfully added.',
        appointment: appointment,
      };
    } catch (error) {
      return {
        success: false,
        reason:
          error.code === 'ER_DUP_ENTRY'
            ? 'The Appointment is already a member of the Token_System.'
            : 'Something went to wrong.',
      };
    }
  }

  async findOne(filter?: Partial<AppointmentFilter>) {
    return await this.appointmentRepository.findOne({
      where: {
        ...filter,
      },
    });
  }

  async findAll(
    user: User,
    filters?: any,
    sorts?: SortProps[],
    pageInfo?: PageInfoProps,
  ): Promise<Appointments> {
    const where: FindManyOptions<Appointment>['where'] = {};
    const order: FindManyOptions<Appointment>['order'] = {};

    if (filters?.id) {
      where['id'] = filters.id;
    }
    if (filters?.status?.length) {
      where['status'] = In(filters.status);
    }

    if (sorts?.length) {
      sorts.forEach((s) => {
        if (['ASC', 'DESC'].includes(s.sortOrder.toUpperCase())) {
          order[s.sortField] = s.sortOrder.toUpperCase();
        } else {
          console.warn(
            `Invalid sortOrder "${s.sortOrder}" for field "${s.sortField}".`,
          );
        }
      });
    }

    const { pageNumber = 1, pageSize = 50 } = pageInfo || {};

    const userFilter: FindOptionsWhere<User> = {};

    if (filters?.usersId?.length) {
      if (!filters.usersId.includes(user.id)) {
        userFilter.id = And(In(filters.usersId), Not(user.id));
      } else {
        userFilter.id = In(filters.usersId);
      }
    }

    const appointmentData = await this.appointmentRepository.find({
      where: {
        ...where,
        user: userFilter,
      },
      relations: ['user'],
      order: { tokenNumber: 'ASC', ...order },
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
    });

    const totalCount = await this.appointmentRepository.count({
      where: {
        ...where,
        user: userFilter,
      },
      relations: ['user'],
    });

    return {
      data: appointmentData,
      pageInfo: {
        pageNumber,
        totalCount,
      },
    };
  }

  async findOneById(id: string) {
    return await this.appointmentRepository.findOne({
      where: {
        id,
      },
    });
  }

  async findOneAppointmentById(id: string, userId: string) {
    return await this.appointmentRepository.findOne({
      where: {
        id,
        user: { id: userId },
      },
      relations: ['user'],
    });
  }

  async findAppointmentByUserId(userId: string): Promise<Appointment[]> {
    return await this.appointmentRepository.find({
      where: { user: { id: userId } },
      relations: ['user', 'business', 'member'],
    });
  }

  async findAppointmentByMemberId(memberId: string): Promise<Appointment[]> {
    return await this.appointmentRepository.find({
      where: { member: { id: memberId } },
      relations: ['member'],
    });
  }

  async lastAppointment(userId: string): Promise<Appointment | string> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayString = today.toISOString();
    return await this.appointmentRepository.findOne({
      where: { user: { id: userId }, date_and_time: MoreThan(todayString) },
      order: { tokenNumber: 'DESC' },
      relations: ['user', 'business', 'member'],
    });
  }

  async update(updateAppointmentInput: UpdateAppointmentInput) {
    try {
      const businessData = await this.businessService.findBusinessById(
        updateAppointmentInput.businessId,
      );
      const appointment: Appointment = new Appointment();
      appointment.id = updateAppointmentInput.id;
      appointment.business = businessData;
      appointment.date_and_time = updateAppointmentInput.date_and_time;
      appointment.tokenNumber = updateAppointmentInput.tokenNumber;

      const update = await this.appointmentRepository.save(appointment);
      if (appointment) {
        return {
          success: true,
          reason: 'Appointment Updated Successfully.',
          update,
        };
      }
    } catch (error) {
      return { success: false, reason: 'Error Something.' };
    }
  }

  async removeAppointment(id: string) {
    try {
      const data = await this.findOneById(id);
      if (data !== null) {
        await this.appointmentRepository.update(id, {
          status: AppointmentStatusEnum.DELETED,
        });
        return {
          success: true,
          message: 'The Appointment is Deleted Successfully.',
        };
      }
    } catch (error) {
      return {
        success: false,
        message: `The Appointment Can't find in database`,
      };
    }
  }
}
