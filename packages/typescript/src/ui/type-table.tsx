import cn from 'clsx'
import Link from 'next/link'
import { Popup } from 'nextra/components'
import { InformationCircleIcon as InfoIcon } from 'nextra/icons'
import type { FC, ReactNode } from 'react'

const Info: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <Popup>
      <Popup.Button>
        <InfoIcon className="size-4" />
      </Popup.Button>
      <Popup.Panel className="prose prose-no-margin max-h-[400px] max-w-[400px] min-w-[220px] overflow-auto text-sm">
        {children}
      </Popup.Panel>
    </Popup>
  )
}

interface ObjectType {
  /**
   * Additional description of the field
   */
  description?: ReactNode
  type: string
  typeDescription?: ReactNode
  /**
   * Optional link to the type
   */
  typeDescriptionLink?: string
  default?: string
  required?: boolean
}

const classes = {
  field: cn('inline-flex flex-row items-center gap-1'),
  code: cn('rounded-md bg-fd-secondary p-1 text-fd-secondary-foreground'),
  blue: 'bg-fd-primary/10 text-fd-primary'
}

export const TypeTable: FC<{ type: Record<string, ObjectType> }> = ({
  type
}) => {
  return (
    <div className="prose prose-no-margin my-6 overflow-auto">
      <table className="text-fd-muted-foreground text-sm whitespace-nowrap">
        <thead>
          <tr>
            <th className="w-[45%]">Name</th>
            <th className="w-[30%]">Type</th>
            <th className="w-1/4">Default</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(type).map(([key, value]) => (
            <tr key={key}>
              <td>
                <div className={classes.field}>
                  <code className={cn(classes.code, classes.blue)}>
                    {key}
                    {!value.required && '?'}
                  </code>
                  {value.description && <Info>{value.description}</Info>}
                </div>
              </td>
              <td>
                <div className={classes.field}>
                  <code className={classes.code}>{value.type}</code>
                  {value.typeDescription && (
                    <Info>{value.typeDescription}</Info>
                  )}
                  {value.typeDescriptionLink && (
                    <Link href={value.typeDescriptionLink}>
                      <InfoIcon className="size-4" />
                    </Link>
                  )}
                </div>
              </td>
              <td>
                {value.default ? (
                  <code className={classes.code}>{value.default}</code>
                ) : (
                  <span>-</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
