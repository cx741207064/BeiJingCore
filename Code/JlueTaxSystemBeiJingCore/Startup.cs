using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using JlueTaxSystemBeiJingCore.Code;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace JlueTaxSystemBeiJingCore
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.Configure<CookiePolicyOptions>(options =>
            {
                // This lambda determines whether user consent for non-essential cookies is needed for a given request.
                options.CheckConsentNeeded = context => false;
                options.MinimumSameSitePolicy = SameSiteMode.None;
            });

            services.AddSingleton<YsbqcSetting>();
            services.AddSingleton<Service>();
            services.AddSingleton<Repository>();
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

            services.AddSession();
            services.AddMemoryCache();

            services.AddMvc(config => { config.Filters.Add<ActionFilter>();}).SetCompatibilityVersion(CompatibilityVersion.Version_2_2);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                //app.UseDeveloperExceptionPage();
                app.UseExceptionHandler("/Error");
            }
            else
            {
                app.UseExceptionHandler("/Error");
            }

            var provider = new FileExtensionContentTypeProvider();
            provider.Mappings[".jsp"] = "text/html";
            app.UseStaticFiles(new StaticFileOptions
            {
                ContentTypeProvider = provider
            });

            app.UseCookiePolicy();

            app.UseSession();

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");
            });

            GTXMethod.config = Configuration;
            GTXMethod.set = ServiceProviderServiceExtensions.GetRequiredService<YsbqcSetting>(app.ApplicationServices);

        }
    }
}
