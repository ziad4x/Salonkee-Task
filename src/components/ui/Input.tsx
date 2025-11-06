import React, { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    textarea?: boolean; // 👈 لو true، هيبقى TextArea
}

const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
    ({ className = "", label, type = "text", error, textarea = false, ...props }, ref) => {
        const baseStyles = `peer w-full rounded-lg px-4 py-3
      
       text-pri 
       placeholder-transparent
       transition duration-200 
       outline-none
       border-2
       ${error
                ? "border-error focus:border-error focus:ring-error"
                : "border-sec  focus:border-pri/50 0  focus:ring-2 focus:ring-pri "} 
       disabled:opacity-50 disabled:cursor-not-allowed
       ` + className;

        return (
            <div className="w-full">
                <div className="relative">
                    {textarea ? (
                        <textarea
                            ref={ref as React.Ref<HTMLTextAreaElement>}
                            placeholder=" "
                            className={baseStyles + " resize-none"} // resize-none عشان تمنع تغيير الحجم الافتراضي
                            {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
                        />
                    ) : (
                        <input
                            ref={ref as React.Ref<HTMLInputElement>}
                            type={type}
                            placeholder=" "
                            className={baseStyles}
                            {...props}
                        />
                    )}

                    <label
                        className={`
              absolute start-4 
              top-1/2 -translate-y-1/2
              font-medium
              pointer-events-none transition-all duration-200 
              peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base 
              peer-placeholder-shown:-translate-y-1/2
              peer-focus:-top-1 
              peer-focus:text-shadow-sm peer-[:not(:placeholder-shown)]:text-shadow-black
              peer-[:not(:placeholder-shown)]:text-pri
              !text-pri
              dark:peer-focus:text-shadow-xs dark:peer-focus:text-shadow-black 
              peer-[:not(:placeholder-shown)]:-top-1 
              dark:text-white
              ${error && "text-error peer-focus:text-error peer-placeholder-shown:text-error peer-[:not(:placeholder-shown)]:text-error"}
            `}
                    >
                        {label}
                    </label>
                </div>
                {error && <p className="mt-1 text-sm text-error">{error}</p>}
            </div>
        );
    }
);

Input.displayName = "Input";

export default React.memo(Input);
