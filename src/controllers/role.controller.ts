import { NextFunction, Request, Response } from 'express';
import RoleService from '../services/role.service';
import { Role } from '../interfaces/roles.interface';

class RoleController {
    public roleService = new RoleService();

    /**
     * Get all roles
     */
    public getRoles = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const findAllRolesData: Role[] = await this.roleService.findAllRoles();
            res.status(200).json({ data: findAllRolesData, message: 'findAll' });
        } catch (error) {
            next(error);
        }
    };

    /**
     * Get role by ID
     */
    public getRoleById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const roleId = req.params.id;
            const findOneRoleData: Role = await this.roleService.findRoleById(roleId);
            res.status(200).json({ data: findOneRoleData, message: 'findOne' });
        } catch (error) {
            next(error);
        }
    };

    /**
     * Create a new role
     */
    public createRole = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const roleData: Partial<Role> = req.body;
            const createRoleData: Role = await this.roleService.createRole(roleData);
            res.status(201).json({ data: createRoleData, message: 'created' });
        } catch (error) {
            next(error);
        }
    };

    /**
     * Update an existing role
     */
    public updateRole = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const roleId = req.params.id;
            const roleData: Partial<Role> = req.body;
            const updateRoleData: Role = await this.roleService.updateRole(roleId, roleData);
            res.status(200).json({ data: updateRoleData, message: 'updated' });
        } catch (error) {
            next(error);
        }
    };

    /**
     * Delete a role
     */
    public deleteRole = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const roleId = req.params.id;
            await this.roleService.deleteRole(roleId);
            res.status(200).json({ message: 'deleted' });
        } catch (error) {
            next(error);
        }
    };
}

export default RoleController;
