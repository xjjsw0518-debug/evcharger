import { useState, type FormEvent } from 'react';

import { Shield, Key, User, Route, Eye, EyeOff, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { toast } from 'sonner';
import { getAdminSession, setAdminLoggedIn } from './AdminLoginPage';
import { formatDistanceToNow } from 'date-fns';

export default function SecuritySettingsSection() {
  const { settings, updateSettings } = useSiteSettings();
  const session = getAdminSession();

  // Change password
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPwd, setShowOldPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [pwdLoading, setPwdLoading] = useState(false);

  // Change username
  const [newUsername, setNewUsername] = useState('');
  const [usernameConfirmPwd, setUsernameConfirmPwd] = useState('');
  const [showUsernamePwd, setShowUsernamePwd] = useState(false);
  const [usernameLoading, setUsernameLoading] = useState(false);

  // Change admin path
  const [newAdminPath, setNewAdminPath] = useState('');
  const [pathConfirmPwd, setPathConfirmPwd] = useState('');
  const [showPathPwd, setShowPathPwd] = useState(false);
  const [pathLoading, setPathLoading] = useState(false);

  const handleChangePassword = async (e: FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error('请填写所有密码字段');
      return;
    }
    if (oldPassword !== settings.adminPassword) {
      toast.error('当前密码不正确');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('新密码长度至少6位');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('两次输入的新密码不一致');
      return;
    }
    if (newPassword === oldPassword) {
      toast.error('新密码不能与旧密码相同');
      return;
    }
    setPwdLoading(true);
    await new Promise(r => setTimeout(r, 500));
    const success = await updateSettings({ adminPassword: newPassword });
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPwdLoading(false);
    if (success) {
      toast.success('✅ 密码修改成功，已同步到服务器，所有电脑生效');
    } else {
      toast.error('❌ 保存到服务器失败，请检查网络');
    }
  };

  const handleChangeUsername = async (e: FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim() || !usernameConfirmPwd) {
      toast.error('请填写所有字段');
      return;
    }
    if (usernameConfirmPwd !== settings.adminPassword) {
      toast.error('密码不正确');
      return;
    }
    if (newUsername.trim() === settings.adminUsername) {
      toast.error('新用户名与当前用户名相同');
      return;
    }
    setUsernameLoading(true);
    await new Promise(r => setTimeout(r, 500));
    const success = await updateSettings({ adminUsername: newUsername.trim() });
    setAdminLoggedIn(newUsername.trim());
    setNewUsername('');
    setUsernameConfirmPwd('');
    setUsernameLoading(false);
    if (success) {
      toast.success('✅ 用户名修改成功，已同步到服务器，所有电脑生效');
    } else {
      toast.error('❌ 保存到服务器失败，请检查网络');
    }
  };

  const handleChangeAdminPath = async (e: FormEvent) => {
    e.preventDefault();
    if (!newAdminPath.trim() || !pathConfirmPwd) {
      toast.error('请填写所有字段');
      return;
    }
    if (pathConfirmPwd !== settings.adminPassword) {
      toast.error('密码不正确');
      return;
    }
    const cleanPath = newAdminPath.trim().replace(/^\/+/, '').replace(/\/+$/, '');
    if (!/^[a-zA-Z0-9_-]+$/.test(cleanPath)) {
      toast.error('路径只能包含字母、数字、横线和下划线');
      return;
    }
    if (cleanPath.length < 3) {
      toast.error('路径长度至少3个字符');
      return;
    }
    if (cleanPath === settings.adminPath) {
      toast.error('新路径与当前路径相同');
      return;
    }
    setPathLoading(true);
    await new Promise(r => setTimeout(r, 500));
    const success = await updateSettings({ adminPath: cleanPath });
    setPathLoading(false);
    if (success) {
      toast.success(`✅ 后台路径已更新，已同步到服务器，即将跳转到新地址 /${cleanPath}`);
      // 必须整页刷新才能让App组件重新读取新路径
      setTimeout(() => {
        const loc = window.location;
        loc.assign(`/${cleanPath}`);
      }, 1200);
    } else {
      toast.error('❌ 保存到服务器失败，请检查网络');
    }
  };

  const loginTimeStr = session?.loggedInAt
    ? formatDistanceToNow(session.loggedInAt, { addSuffix: true })
    : '-';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">Security Settings</h2>
        <p className="text-sm text-muted-foreground mt-1">安全设置 · 管理后台访问权限与凭据</p>
      </div>

      {/* Login status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="size-4 text-primary" />
            当前登录状态
          </CardTitle>
          <CardDescription>Login Status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-3 rounded-lg bg-muted/50 border border-border/40">
              <p className="text-xs text-muted-foreground mb-1">当前用户</p>
              <p className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                <User className="size-3.5 text-primary" />
                {session?.username || '-'}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50 border border-border/40">
              <p className="text-xs text-muted-foreground mb-1">登录时间</p>
              <p className="text-sm font-semibold text-foreground">
                {loginTimeStr}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-success/10 border border-success/20">
              <p className="text-xs text-muted-foreground mb-1">状态</p>
              <p className="text-sm font-semibold text-success flex items-center gap-1.5">
                <Check className="size-3.5" />
                已登录
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Change password */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Key className="size-4 text-primary" />
            修改密码
          </CardTitle>
          <CardDescription>Change Password</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">当前密码</label>
              <div className="relative">
                <Input
                  type={showOldPwd ? 'text' : 'password'}
                  value={oldPassword}
                  onChange={e => setOldPassword(e.target.value)}
                  className="pr-10"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowOldPwd(!showOldPwd)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                >
                  {showOldPwd ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">新密码</label>
              <div className="relative">
                <Input
                  type={showNewPwd ? 'text' : 'password'}
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="pr-10"
                  placeholder="Enter new password (min 6 chars)"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPwd(!showNewPwd)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                >
                  {showNewPwd ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">确认新密码</label>
              <div className="relative">
                <Input
                  type={showConfirmPwd ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="pr-10"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPwd(!showConfirmPwd)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                >
                  {showConfirmPwd ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" disabled={pwdLoading} size="sm">
              {pwdLoading ? '保存中...' : '保存新密码'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Separator />

      {/* Change username */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <User className="size-4 text-primary" />
            修改用户名
          </CardTitle>
          <CardDescription>Change Username · 需要验证当前密码</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangeUsername} className="space-y-4 max-w-md">
            <div className="p-3 rounded-md bg-muted/50 border border-border/40 text-sm">
              <span className="text-muted-foreground">当前用户名：</span>
              <span className="font-semibold text-foreground">{settings.adminUsername}</span>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">新用户名</label>
              <Input
                value={newUsername}
                onChange={e => setNewUsername(e.target.value)}
                placeholder="Enter new username"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">当前密码（确认身份）</label>
              <div className="relative">
                <Input
                  type={showUsernamePwd ? 'text' : 'password'}
                  value={usernameConfirmPwd}
                  onChange={e => setUsernameConfirmPwd(e.target.value)}
                  className="pr-10"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowUsernamePwd(!showUsernamePwd)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                >
                  {showUsernamePwd ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" disabled={usernameLoading} size="sm">
              {usernameLoading ? '保存中...' : '修改用户名'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Separator />

      {/* Change admin path */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Route className="size-4 text-primary" />
            修改后台路径
          </CardTitle>
          <CardDescription>Change Admin Path · 自定义隐蔽后台访问路径</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangeAdminPath} className="space-y-4 max-w-md">
            <div className="p-3 rounded-md bg-warning/10 border border-warning/20 text-sm flex items-start gap-2">
              <AlertCircle className="size-4 text-warning shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-foreground">注意</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  修改路径后，当前后台访问地址将立即变更，请牢记新路径。当前路径：<code className="bg-background px-1.5 py-0.5 rounded text-xs">/{settings.adminPath}</code>
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">新路径</label>
              <div className="flex items-center">
                <span className="text-sm text-muted-foreground mr-2">/</span>
                <Input
                  value={newAdminPath}
                  onChange={e => setNewAdminPath(e.target.value)}
                  placeholder="new-manage-path"
                  className="flex-1"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                仅支持字母、数字、横线和下划线，长度至少3位
              </p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">当前密码（确认身份）</label>
              <div className="relative">
                <Input
                  type={showPathPwd ? 'text' : 'password'}
                  value={pathConfirmPwd}
                  onChange={e => setPathConfirmPwd(e.target.value)}
                  className="pr-10"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowPathPwd(!showPathPwd)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                >
                  {showPathPwd ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" disabled={pathLoading} size="sm" variant="destructive">
              {pathLoading ? '保存中...' : '修改后台路径'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
