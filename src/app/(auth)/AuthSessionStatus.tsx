interface AuthSessionStatusProps {
    status?: string;
    className?: string;
    [key: string]: any;
}

const AuthSessionStatus = ({ status, className, ...props }: AuthSessionStatusProps) => (
  <>
      {status && (
          <div
              className={`${className} font-medium text-sm text-green-600`}
              {...props}>
              {status}
          </div>
      )}
  </>
)

export default AuthSessionStatus
