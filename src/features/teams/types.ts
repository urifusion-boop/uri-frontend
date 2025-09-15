export interface ITeamMember {
  name: string;
  email: string;
  role: string;
  lastLogin: string;
}

export interface TeamMemberActionModalProps {
  open: boolean;
  onClose: () => void;
  teamMember?: ITeamMember;
  action: 'edit' | 'delete';
}

export interface IManageRoleSidebarProps {
  teamRoles: { id: string; label: string }[];
  selectedRole: string;
  setSelectedRole: (roleId: string) => void;
}

export interface InviteTeamMemberModalProps {
  open: boolean;
  onClose: () => void;
}

interface MobileTeamMember extends ITeamMember {
  checkbox: React.ReactNode;
  actions: React.ReactNode | string;
}

export interface MobileTeamsTableProps {
  data: MobileTeamMember[];
}

export type ActionModalState = 'form' | 'success' | 'error';

export type InviteModalState = 'form' | 'success' | 'error' | 'alreadyInvited' | 'alreadyTeamMember';
