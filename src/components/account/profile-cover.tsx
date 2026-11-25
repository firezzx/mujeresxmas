import { AccountCard } from "@/components/account/account-card"
import { AvatarUploader } from "@/components/account/avatar-uploader"
import { ProfileForm } from "@/components/account/profile-form"
import { BlurFade } from "@/components/ui/blur-fade"
import type { CurrentUser } from "@/lib/supabase/user"
import type { ProfileField } from "@/lib/validations/profile"

// Debajo de la portada del perfil: la foto grande montada sobre el borde del banner, con el nombre
// al lado, y abajo el formulario a todo el ancho.
export function ProfileCover({
  user,
  values,
  description,
}: {
  user: CurrentUser
  values: Record<ProfileField, string>
  description: string
}) {
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ")

  return (
    <div className="flex flex-col gap-10">
      <AvatarUploader
        user={user}
        variant="cover"
        heading={
          <>
            <h1 className="font-heading text-3xl leading-tight font-semibold tracking-[-0.02em] text-balance break-words sm:truncate sm:text-4xl">
              {fullName || "Tu perfil"}
            </h1>
            <p className="truncate text-sm text-muted-foreground">{user.email}</p>
          </>
        }
      />
      <BlurFade delay={0.2} inView>
        <AccountCard className="flex flex-col gap-6">
          <div>
            <h2 className="font-heading text-lg font-semibold tracking-[-0.01em]">Tus datos</h2>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          </div>
          <ProfileForm initialValues={values} wide />
        </AccountCard>
      </BlurFade>
    </div>
  )
}
