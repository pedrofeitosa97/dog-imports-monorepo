import { Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe, ForbiddenException } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { IsString, IsEmail, MinLength, IsBoolean } from 'class-validator';

class CreateAdminDto {
  @IsString() name: string;
  @IsEmail() email: string;
  @IsString() @MinLength(6) password: string;
}

class SetAdminDto {
  @IsBoolean() isAdmin: boolean;
}

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Listar usuários (admin)' })
  findAll(@CurrentUser() user: { isAdmin: boolean }) {
    if (!user?.isAdmin) throw new ForbiddenException();
    return this.usersService.findAll();
  }

  @Post('admin')
  @ApiOperation({ summary: 'Criar conta de administrador (admin)' })
  async createAdmin(
    @Body() dto: CreateAdminDto,
    @CurrentUser() user: { isAdmin: boolean },
  ) {
    if (!user?.isAdmin) throw new ForbiddenException();
    const created = await this.usersService.create({ ...dto, isAdmin: true });
    const { password: _pw, ...result } = created;
    return result;
  }

  @Patch(':id/admin')
  @ApiOperation({ summary: 'Definir/remover admin de um usuário (admin)' })
  setAdmin(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: SetAdminDto,
    @CurrentUser() user: { id: number; isAdmin: boolean },
  ) {
    if (!user?.isAdmin) throw new ForbiddenException();
    if (user.id === id) throw new ForbiddenException('Você não pode alterar sua própria role');
    return this.usersService.setAdmin(id, dto.isAdmin);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar usuário (admin)' })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { id: number; isAdmin: boolean },
  ) {
    if (!user?.isAdmin) throw new ForbiddenException();
    if (user.id === id) throw new ForbiddenException('Você não pode deletar sua própria conta');
    await this.usersService.remove(id);
    return { success: true };
  }
}
